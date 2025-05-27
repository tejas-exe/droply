import { HeroUIProvider } from "@heroui/system";
import { IKContext } from "imagekitio-react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const authenticator = async () => {
    const res = await fetch("/api/imagekit-auth");
    if (!res.ok) throw new Error("Failed to fetch auth params");
    return await res.json();
  };

  return (
    // <IKContext
    //   publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
    //   urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
    //   authenticator={authenticator}
    // >
    <HeroUIProvider>{children}</HeroUIProvider>
    // </IKContext>
  );
};

export default Providers;
