import AuthClientComponent from "./client-auth";

const AuthPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) => {
  const formType = (await searchParams).type === "signin" ? "signin" : "signup";

  return (
    <AuthClientComponent
      type={formType}
      title={formType === "signin" ? "Sign In" : "Sign Up"}
      description={
        formType === "signin"
          ? "Sign in to your account to get started"
          : "Create an account to get started"
      }
    />
  );
};

export default AuthPage;
