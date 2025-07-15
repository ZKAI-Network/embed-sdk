# Task to get done today

The goal is to implement the following Search endpoints to get a client.search.<function> namespace done just like we have a client.feed.<function> endpoint

Follow the pattern laid out in packages/sdk/src/feed and the corresponding namespace import and definitions in client.ts

The types for input requirements and options are all present in the `packages/types` types packages for reference and import. use these types just like we did for the feed endpoints.

## .search. functions to be done

### .search.users.similar(userId, options)

implementing the /users/feed/similar endpoint on the API with userId mapping to user_id on the body of the POST request and top_k being left in the options.

note in the jsdocs that top_k by default is 25. the userId parameter is required.

This function returns a list of similar users for an input user_id (fid)

The return format being the following (where we will unpack it and return the data just like we do for other endpoints and add the type to types-return in `packages/types`. We then import the type from there.)

```JSON
{
  "status_code": 200,
  "body": [
    {
      "user_id": "16085",
      "score": 0.999977767
    },
    {
      "user_id": "3",
      "score": 0.931880295
    },
    {
      "user_id": "296",
      "score": 0.915372968
    },
    {
      "user_id": "473",
      "score": 0.913523
    },
    {
      "user_id": "11528",
      "score": 0.913413048
    },
    {
      "user_id": "617728",
      "score": 0.906909
    },
    {
      "user_id": "233242",
      "score": 0.904561102
    },
    {
      "user_id": "280",
      "score": 0.90350467
    },
    {
      "user_id": "319543",
      "score": 0.9023121
    },
    {
      "user_id": "566067",
      "score": 0.899396122
    },
    {
      "user_id": "875824",
      "score": 0.898574352
    },
    {
      "user_id": "705234",
      "score": 0.898167253
    },
    {
      "user_id": "3621",
      "score": 0.897473097
    },
    {
      "user_id": "192300",
      "score": 0.897371292
    },
    {
      "user_id": "472",
      "score": 0.896455526
    },
    {
      "user_id": "329769",
      "score": 0.896232665
    },
    {
      "user_id": "352723",
      "score": 0.895664454
    },
    {
      "user_id": "373",
      "score": 0.894632578
    },
    {
      "user_id": "194",
      "score": 0.893405735
    },
    {
      "user_id": "875813",
      "score": 0.892652571
    },
    {
      "user_id": "680",
      "score": 0.892629206
    },
    {
      "user_id": "581",
      "score": 0.892383933
    },
    {
      "user_id": "21431",
      "score": 0.891760409
    },
    {
      "user_id": "616",
      "score": 0.891604066
    },
    {
      "user_id": "6227",
      "score": 0.891317368
    }
  ]
}
```

### .search.users.byQuery(query, options)

implementing the `/users/search/semantic` endpoint on the API with query mapping to query on the body of the POST request and top_k being left in the options.

note in the jsdocs that top_k by default is 25. the query parameter is required.

This function takes text as query input and searches for users that are "similar" to the content of the text

The return format being the following (where we will unpack it and return the data just like we do for other endpoints and add the type to types-return in `packages/types`. We then import the type from there.) Make sure we reuse them when they are the same format across responses.

```JSON
{
  "status_code": 200,
  "body": [
    {
      "user_id": "444746",
      "score": 0.697465777
    },
    {
      "user_id": "544388",
      "score": 0.65347755
    },
    {
      "user_id": "507350",
      "score": 0.618862927
    },
    {
      "user_id": "541903",
      "score": 0.615001261
    },
    {
      "user_id": "746925",
      "score": 0.614903
    },
    {
      "user_id": "233122",
      "score": 0.593102157
    },
    {
      "user_id": "798204",
      "score": 0.589281619
    },
    {
      "user_id": "240036",
      "score": 0.588986695
    },
    {
      "user_id": "749096",
      "score": 0.587067068
    },
    {
      "user_id": "752972",
      "score": 0.585627556
    }
  ]
}
```


### .search.users.getTopByLabel(label, options)

implementing the `/users/labels/top-users` endpoint on the API with query mapping to query on the body of the POST request and top_k being left in the options.

note in the jsdocs the defaults and limits on the API options. the label parameter is required.

Get a list of users with the highest or lowest score of an AI label

This function takes a AI label name (we have types for these as literals in `packages/types`!!!! as input and returns a list of users with either the highest or lowest scores for that label.

To provide more control for exploration, you can specify the minimum activity count required for the user to be considered, and also a ratio range and a confidence range to be considered. ratio is the percentage of the user's activity related ot the specified label, and confidence is the AI model confidence score (returned as score in the API results)

The API returns the user_id (fid), score (for the label), count (number of activities related to the label), and ratio (percentage of activities related to the label)

Top_k defaults to 100 and is max 1000 with the other defaults on the options being minimum_activity_count
number

the minimum number of activity count required for the user to be included in the results (default 10)
ratio_min
number

the minimum ratio of activity related to the specified label (must be a value between 0 and 1 - default 0.75)
conf_min
number

the minimum AI model confidence score for the specified label (must be a value between 0 and 1 - default 0.6)

The return format being the following (where we will unpack it and return the data just like we do for other endpoints and add the type to types-return in `packages/types`. We then import the type from there.) Make sure we reuse them when they are thje same format across responses.

```JSON
{
  "status_code": 200,
  "body": [
    {
      "user_id": "520701",
      "score": 0.9471641778666666,
      "count": 12,
      "ratio": 1
    },
    {
      "user_id": "977847",
      "score": 0.9423802040390001,
      "count": 99,
      "ratio": 0.99
    },
    {
      "user_id": "1039666",
      "score": 0.9399582743999992,
      "count": 63,
      "ratio": 1
    },
    {
      "user_id": "1039605",
      "score": 0.9399582743999991,
      "count": 50,
      "ratio": 1
    },
    {
      "user_id": "1039562",
      "score": 0.939958274399999,
      "count": 59,
      "ratio": 1
    },
    {
      "user_id": "379938",
      "score": 0.9399582743999988,
      "count": 156,
      "ratio": 1
    },
    {
      "user_id": "1096118",
      "score": 0.9380078088714285,
      "count": 21,
      "ratio": 1
    },
    {
      "user_id": "572749",
      "score": 0.9371541996790368,
      "count": 2706,
      "ratio": 0.9966850828729282
    },
    {
      "user_id": "1107101",
      "score": 0.9361463338297606,
      "count": 502,
      "ratio": 0.996031746031746
    },
    {
      "user_id": "442416",
      "score": 0.9358774472477284,
      "count": 2470,
      "ratio": 0.9951651893634166
    }
  ]
}
```

### .search.users.getLabels(userList: [string], labelCategory, options)

implementing the `/users/labels/for-users` endpoint on the API with userList = [userId] = [string] mapping to users_list on the body of the POST request and labelCategory mapping to label_category. We will default label_category to all if not set by the user.

note in the jsdocs the default for labelCategory being all. the userList [userId] parameter is required.

This function returns a list of similar users for an input user_id (fid)

The return format being the following (where we will unpack it and return the data just like we do for other endpoints and add the type to types-return in `packages/types`. We then import the type from there.)

```JSON
{
  "status_code": 200,
  "body": [
    {
      "user_id": "16085",
      "ai_labels": {
        "topics": [
          {
            "label": "arts_culture",
            "score": 0.023266956986850353
          },
          {
            "label": "business_entrepreneurs",
            "score": 0.226176880102288
          },
          {
            "label": "celebrity_pop_culture",
            "score": 0.04313708646573834
          },
          {
            "label": "diaries_daily_life",
            "score": 0.2784684462023312
          },
          {
            "label": "family",
            "score": 0.01119854509540733
          },
          {
            "label": "fashion_style",
            "score": 0.012113745959559342
          },
          {
            "label": "film_tv_video",
            "score": 0.05616957244652685
          },
          {
            "label": "fitness_health",
            "score": 0.024922887912412945
          },
          {
            "label": "food_dining",
            "score": 0.027259332376090354
          },
          {
            "label": "gaming",
            "score": 0.047862322515172376
          },
          {
            "label": "learning_educational",
            "score": 0.034252154039396195
          },
          {
            "label": "music",
            "score": 0.027653844881310886
          },
          {
            "label": "news_social_concern",
            "score": 0.1246655631718431
          },
          {
            "label": "other_hobbies",
            "score": 0.16084933267858761
          },
          {
            "label": "relationships",
            "score": 0.025529085770084593
          },
          {
            "label": "science_technology",
            "score": 0.3499412533385105
          },
          {
            "label": "sports",
            "score": 0.07118383988798957
          },
          {
            "label": "travel_adventure",
            "score": 0.03914931786956957
          },
          {
            "label": "youth_student_life",
            "score": 0.00859636905130191
          }
        ],
        "sentiment": [
          {
            "label": "positive",
            "score": 0.42078091942547113
          },
          {
            "label": "neutral",
            "score": 0.4523035528038612
          },
          {
            "label": "negative",
            "score": 0.12691552789914884
          }
        ],
        "emotion": [
          {
            "label": "anger",
            "score": 0.13308502056803562
          },
          {
            "label": "anticipation",
            "score": 0.43137459825356106
          },
          {
            "label": "disgust",
            "score": 0.14904605559064774
          },
          {
            "label": "fear",
            "score": 0.04455464442269004
          },
          {
            "label": "joy",
            "score": 0.5295536957147051
          },
          {
            "label": "love",
            "score": 0.09619421706340414
          },
          {
            "label": "optimism",
            "score": 0.42986683515352764
          },
          {
            "label": "pessimism",
            "score": 0.04849178521304813
          },
          {
            "label": "sadness",
            "score": 0.10370781033468701
          },
          {
            "label": "surprise",
            "score": 0.09907488256295151
          },
          {
            "label": "trust",
            "score": 0.10747302473397183
          }
        ],
        "moderation": [
          {
            "label": "llm_generated",
            "score": 0.030893141707518557
          },
          {
            "label": "spam",
            "score": 0.14769061530341726
          },
          {
            "label": "sexual",
            "score": 0.0027806300791852158
          },
          {
            "label": "hate",
            "score": 0.009859480432668094
          },
          {
            "label": "violence",
            "score": 0.00474745432932003
          },
          {
            "label": "harassment",
            "score": 0.0034082671324376958
          },
          {
            "label": "selfharm",
            "score": 0.005231168801796165
          },
          {
            "label": "sexual_minors",
            "score": 0.0015119743046439346
          },
          {
            "label": "hate_threatening",
            "score": 0.0017926527733606809
          },
          {
            "label": "violence_graphic",
            "score": 0.0019783703769712894
          }
        ]
      }
    },
    {
      "user_id": "239",
      "ai_labels": {
        "topics": [
          {
            "label": "arts_culture",
            "score": 0.030202004848956267
          },
          {
            "label": "business_entrepreneurs",
            "score": 0.19870765609622904
          },
          {
            "label": "celebrity_pop_culture",
            "score": 0.06065259989538275
          },
          {
            "label": "diaries_daily_life",
            "score": 0.3701807130597239
          },
          {
            "label": "family",
            "score": 0.019145860349522512
          },
          {
            "label": "fashion_style",
            "score": 0.020514880708421297
          },
          {
            "label": "film_tv_video",
            "score": 0.06072056318548842
          },
          {
            "label": "fitness_health",
            "score": 0.042931680979306316
          },
          {
            "label": "food_dining",
            "score": 0.052947929684363945
          },
          {
            "label": "gaming",
            "score": 0.04437493209960442
          },
          {
            "label": "learning_educational",
            "score": 0.03170891810159253
          },
          {
            "label": "music",
            "score": 0.041881116316356416
          },
          {
            "label": "news_social_concern",
            "score": 0.16393361734604797
          },
          {
            "label": "other_hobbies",
            "score": 0.14696201883053425
          },
          {
            "label": "relationships",
            "score": 0.04087316674783243
          },
          {
            "label": "science_technology",
            "score": 0.19184815490986365
          },
          {
            "label": "sports",
            "score": 0.08977232777270107
          },
          {
            "label": "travel_adventure",
            "score": 0.0501991157993623
          },
          {
            "label": "youth_student_life",
            "score": 0.012394711817143873
          }
        ],
        "sentiment": [
          {
            "label": "positive",
            "score": 0.4192146984528466
          },
          {
            "label": "neutral",
            "score": 0.40780292313448696
          },
          {
            "label": "negative",
            "score": 0.1729823785832676
          }
        ],
        "emotion": [
          {
            "label": "anger",
            "score": 0.16225189911883256
          },
          {
            "label": "anticipation",
            "score": 0.3734459317772492
          },
          {
            "label": "disgust",
            "score": 0.1806285041956915
          },
          {
            "label": "fear",
            "score": 0.05829309292234674
          },
          {
            "label": "joy",
            "score": 0.5352616562729599
          },
          {
            "label": "love",
            "score": 0.12213927027233107
          },
          {
            "label": "optimism",
            "score": 0.4098949858839917
          },
          {
            "label": "pessimism",
            "score": 0.05867046997866672
          },
          {
            "label": "sadness",
            "score": 0.1381399681423812
          },
          {
            "label": "surprise",
            "score": 0.1032899111063118
          },
          {
            "label": "trust",
            "score": 0.09567006807995727
          }
        ],
        "moderation": [
          {
            "label": "llm_generated",
            "score": 0.02442172945385002
          },
          {
            "label": "spam",
            "score": 0.11832752486394711
          },
          {
            "label": "sexual",
            "score": 0.005918977955180189
          },
          {
            "label": "hate",
            "score": 0.017074407858027135
          },
          {
            "label": "violence",
            "score": 0.00810314834000964
          },
          {
            "label": "harassment",
            "score": 0.006527270453375935
          },
          {
            "label": "selfharm",
            "score": 0.009223766651105239
          },
          {
            "label": "sexual_minors",
            "score": 0.002962649092119758
          },
          {
            "label": "hate_threatening",
            "score": 0.0032980848126660804
          },
          {
            "label": "violence_graphic",
            "score": 0.0034337020174555334
          }
        ]
      }
    },
    {
      "user_id": "3",
      "ai_labels": {
        "topics": [
          {
            "label": "arts_culture",
            "score": 0.028890968173264312
          },
          {
            "label": "business_entrepreneurs",
            "score": 0.22863449583054934
          },
          {
            "label": "celebrity_pop_culture",
            "score": 0.04279095756616956
          },
          {
            "label": "diaries_daily_life",
            "score": 0.2635428946408835
          },
          {
            "label": "family",
            "score": 0.013027405940618873
          },
          {
            "label": "fashion_style",
            "score": 0.011255665781634592
          },
          {
            "label": "film_tv_video",
            "score": 0.06470708396818961
          },
          {
            "label": "fitness_health",
            "score": 0.02960480481451678
          },
          {
            "label": "food_dining",
            "score": 0.04065685826215789
          },
          {
            "label": "gaming",
            "score": 0.04699420546578067
          },
          {
            "label": "learning_educational",
            "score": 0.03557193377777415
          },
          {
            "label": "music",
            "score": 0.028538576005753644
          },
          {
            "label": "news_social_concern",
            "score": 0.19770148202899734
          },
          {
            "label": "other_hobbies",
            "score": 0.13916989915134143
          },
          {
            "label": "relationships",
            "score": 0.021391478875346846
          },
          {
            "label": "science_technology",
            "score": 0.320557666568786
          },
          {
            "label": "sports",
            "score": 0.06408952053435293
          },
          {
            "label": "travel_adventure",
            "score": 0.03621243957227522
          },
          {
            "label": "youth_student_life",
            "score": 0.009825875479697392
          }
        ],
        "sentiment": [
          {
            "label": "positive",
            "score": 0.33999515704445094
          },
          {
            "label": "neutral",
            "score": 0.48029118730628206
          },
          {
            "label": "negative",
            "score": 0.17971365547032947
          }
        ],
        "emotion": [
          {
            "label": "anger",
            "score": 0.18342898832458024
          },
          {
            "label": "anticipation",
            "score": 0.4197498793671377
          },
          {
            "label": "disgust",
            "score": 0.20437414268130416
          },
          {
            "label": "fear",
            "score": 0.053349780674159596
          },
          {
            "label": "joy",
            "score": 0.4410461095002397
          },
          {
            "label": "love",
            "score": 0.06897655023579141
          },
          {
            "label": "optimism",
            "score": 0.3651738613385423
          },
          {
            "label": "pessimism",
            "score": 0.061070620421917944
          },
          {
            "label": "sadness",
            "score": 0.13032277152622587
          },
          {
            "label": "surprise",
            "score": 0.10020104647136996
          },
          {
            "label": "trust",
            "score": 0.08966808286805596
          }
        ],
        "moderation": [
          {
            "label": "llm_generated",
            "score": 0.036003957090849616
          },
          {
            "label": "spam",
            "score": 0.13677754662710054
          },
          {
            "label": "sexual",
            "score": 0.004012229278824369
          },
          {
            "label": "hate",
            "score": 0.011602421464670469
          },
          {
            "label": "violence",
            "score": 0.006494959049944906
          },
          {
            "label": "harassment",
            "score": 0.004736749168396279
          },
          {
            "label": "selfharm",
            "score": 0.007050489122602258
          },
          {
            "label": "sexual_minors",
            "score": 0.0027068508382408875
          },
          {
            "label": "hate_threatening",
            "score": 0.003110292138462883
          },
          {
            "label": "violence_graphic",
            "score": 0.003198340918667337
          }
        ]
      }
    }
  ]
}

```
