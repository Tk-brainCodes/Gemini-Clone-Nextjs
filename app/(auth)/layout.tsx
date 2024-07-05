import React from "react";

type LayoutProp = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: LayoutProp) => {
  return (
    <div className='h-[100vh] flex flex-col items-center justify-center'>
      {children}
    </div>
  );
};

export default AuthLayout;
