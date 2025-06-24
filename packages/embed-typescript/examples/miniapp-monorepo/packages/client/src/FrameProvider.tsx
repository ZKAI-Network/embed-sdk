import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import sdk, {
  type FrameNotificationDetails,
  type Context,
} from "@farcaster/frame-sdk";
import { isMobileContext } from "./utils/index";
import { showToast } from "./components/generic/ToastHelper";

interface FrameContextType {
  isSDKLoaded: boolean;
  isRunningOnFrame: boolean;
  isRunningOnMobile: boolean;
  context?: Context.FrameContext;
  added: boolean;
  notificationDetails: FrameNotificationDetails | null;
  lastEvent: string;
  actions: {
    openUrl: (url: string) => void;
    close: () => void;
    addFrame: () => Promise<any>;
    viewProfile: (params: { fid: number }) => void;
    composeCast: (params: {
      text?: string;
      embeds?: [] | [string] | [string, string];
      parent?: { type: "cast"; hash: string };
    }) => Promise<{ cast: any | null } | undefined>;
  };
  frameInfo?: {
    environment: "server" | "client";
  };
}

const FrameContext = createContext<FrameContextType>({
  isSDKLoaded: false,
  isRunningOnFrame: false,
  isRunningOnMobile: false,
  added: false,
  notificationDetails: null,
  lastEvent: "",
  actions: {
    openUrl: () => {},
    close: () => {},
    addFrame: async () => {},
    viewProfile: () => {},
    composeCast: async () => {
      return undefined;
    },
  },
});

export const useFrame = () => useContext(FrameContext);

export default function FrameProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [added, setAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] =
    useState<FrameNotificationDetails | null>(null);
  const [lastEvent, setLastEvent] = useState("");

  const [isRunningOnMobile, setIsRunningOnMobile] = useState(false);
  const [isRunningOnFrame, setIsRunningOnFrame] = useState(false);

  // Update notification details when context changes
  useEffect(() => {
    setNotificationDetails(context?.client.notificationDetails ?? null);
  }, [context]);

  // Frame detection effect
  useEffect(() => {
    setIsRunningOnMobile(isMobileContext());
  }, []);

  // SDK initialization and event handling
  useEffect(() => {
    const load = async () => {
      try {
        const frameContext = await sdk.context;
        if (!frameContext) {
          console.warn("Frame context not found");
          return;
        }

        setIsRunningOnFrame(true);

        setContext(frameContext);
        setAdded(frameContext.client.added);

        // Set up event listeners
        sdk.on("frameAdded", ({ notificationDetails }) => {
          setLastEvent(
            `frameAdded${
              !!notificationDetails ? ", notifications enabled" : ""
            }`
          );
          setAdded(true);
          if (notificationDetails) {
            setNotificationDetails(notificationDetails);
          }
        });

        sdk.on("frameAddRejected", ({ reason }) => {
          setLastEvent(`frameAddRejected, reason ${reason}`);
        });

        sdk.on("frameRemoved", () => {
          setLastEvent("frameRemoved");
          setAdded(false);
          setNotificationDetails(null);
        });

        sdk.on("notificationsEnabled", ({ notificationDetails }) => {
          setLastEvent("notificationsEnabled");
          setNotificationDetails(notificationDetails);
        });

        sdk.on("notificationsDisabled", () => {
          setLastEvent("notificationsDisabled");
          setNotificationDetails(null);
        });

        sdk.on("primaryButtonClicked", () => {
          setLastEvent("primaryButtonClicked");
        });

        sdk.actions.ready();

        console.log("Frame SDK initialized successfully");
      } catch (error) {
        console.error("Error initializing Frame SDK:", error);
      }
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();

      // Cleanup event listeners when component unmounts
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  // Action handlers
  const openUrl = useCallback((url: string) => {
    sdk.actions.openUrl(url);
  }, []);

  const close = useCallback(() => {
    sdk.actions.close();
  }, []);

  const addFrame = useCallback(async () => {
    try {
      const result = await sdk.actions.addFrame();
      if (result.notificationDetails) {
        setNotificationDetails(result.notificationDetails);
      }
      return result;
    } catch (error) {
      console.error("Error adding frame:", error);
      throw error;
    }
  }, []);

  const viewProfile = useCallback(({ fid }: { fid: number }) => {
    try {
      sdk.actions.viewProfile({ fid });
    } catch (error) {
      console.error("Error viewing profile:", error);
    }
  }, []);

  const composeCast = useCallback(
    async (params: {
      text?: string;
      embeds?: [] | [string] | [string, string];
      parent?: { type: "cast"; hash: string };
    }) => {
      if (!isRunningOnFrame) {
        showToast({
          type: "error",
          message: "You can only cast within a Farcaster client",
        });
        return;
      }
      try {
        return await sdk.actions.composeCast(params);
      } catch (error) {
        console.error("Error composing cast:", error);
      }
    },
    [isRunningOnFrame]
  );

  const actions = {
    openUrl,
    close,
    addFrame,
    viewProfile,
    composeCast,
  };

  return (
    <FrameContext.Provider
      value={{
        isSDKLoaded,
        isRunningOnFrame,
        isRunningOnMobile,
        context,
        added,
        notificationDetails,
        lastEvent,
        actions,
      }}
    >
      {children}
    </FrameContext.Provider>
  );
} 
