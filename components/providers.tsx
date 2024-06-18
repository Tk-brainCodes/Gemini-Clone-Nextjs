"use client";

import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/nextjs";
import store from "@/redux/store";

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ClerkProvider>
      <Provider store={store}>{children}</Provider>
    </ClerkProvider>
  );
};

export default Providers;
