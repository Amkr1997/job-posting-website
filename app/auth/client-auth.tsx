"use client";

import {
  signInUserSchema,
  signInUserSchemaType,
  signUpUserSchema,
  signUpUserSchemaType,
} from "@/types/userFormSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { signin, signup } from "@/lib/actions/auth-action";

interface AuthClientComponentProps {
  type: "signup" | "signin";
  title: string;
  description: string;
}

const AuthClientComponent = ({
  type,
  title,
  description,
}: AuthClientComponentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<signUpUserSchemaType>({
    resolver: zodResolver(signUpUserSchema),
  });

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: signInUserErrors },
    resetField: resetFieldSignIn,
  } = useForm<signInUserSchemaType>({
    resolver: zodResolver(signInUserSchema),
  });

  const switchFormType = (newFormType: "signin" | "signup") => {
    if (newFormType === "signin") {
      resetFieldSignIn("email");
      resetFieldSignIn("password");
    } else {
      resetField("name");
      resetField("email");
      resetField("password");
      resetField("confirmPassword");
    }

    const params = new URLSearchParams(searchParams);
    params.set("type", newFormType);
    router.push(`/auth?${params.toString()}`);
  };

  const onSignUpSubmit: SubmitHandler<signUpUserSchemaType> = async (data) => {
    try {
      const { name, email, password } = data;
      const result = await signup(name, email, password);

      if (!result.user) {
        console.log(result);
        throw new Error("Failed to sign up");
      }

      resetField("name");
      resetField("email");
      resetField("password");
      resetField("confirmPassword");
    } catch (error) {
      console.error(error);
    }
  };

  const onSignInSubmit: SubmitHandler<signInUserSchemaType> = async (data) => {
    try {
      const { email, password } = data;
      const result = await signin(email, password);

      if (!result.user) {
        throw new Error("Failed to sign in");
      }

      resetFieldSignIn("email");
      resetFieldSignIn("password");
    } catch (error) {
      console.error(error);
      throw new Error("Failed to sign in");
    }
  };
  return (
    <>
      <section className="max-w-[50vw] mx-auto pt-10">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        <p className="text-center text-gray-500">{description}</p>
        <form
          onSubmit={
            type === "signup"
              ? handleSubmit(onSignUpSubmit)
              : handleSubmitSignIn(onSignInSubmit)
          }
          className="flex flex-col gap-2 w-full"
        >
          {type === "signup" && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="border border-gray-300 rounded-md p-2"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="border border-gray-300 rounded-md p-2"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="border border-gray-300 rounded-md p-2"
                />
                {type === "signup" && errors?.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  className="border border-gray-300 rounded-md p-2"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {type === "signin" && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  {...registerSignIn("email")}
                  className="border border-gray-300 rounded-md p-2"
                />
                {signInUserErrors.email && (
                  <p className="text-red-500">
                    {signInUserErrors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  {...registerSignIn("password")}
                  className="border border-gray-300 rounded-md p-2"
                />
                {signInUserErrors.password && (
                  <p className="text-red-500">
                    {signInUserErrors.password.message}
                  </p>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2"
          >
            Submit
          </button>
        </form>

        <div className="flex justify-center gap-2 py-4">
          {searchParams.get("type") === "signin" ? (
            <button type="button" onClick={() => switchFormType("signup")}>
              Don&apos;t have an account create one
            </button>
          ) : (
            <button type="button" onClick={() => switchFormType("signin")}>
              Already have an account? Sign in
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default AuthClientComponent;
