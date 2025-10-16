"use client";

import { usersFormSchema, usersFormSchemaType } from "@/types/userFormSchema";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
  } = useForm<usersFormSchemaType>({
    resolver: zodResolver(usersFormSchema),
  });

  const switchFormType = (newFormType: "signin" | "signup") => {
    if (newFormType === "signin") {
      resetField("email");
      resetField("password");
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

  const onSubmit: SubmitHandler<usersFormSchemaType> = (data) => {
    try {
      if (type === "signup") {
        const { name, email, password, confirmPassword } = data;
        console.log(name, email, password, confirmPassword);
      } else {
        const { email, password } = data;
        console.log(email, password);
      }
    } catch (error) {
      console.error(error);
    } finally {
      resetField("email");
      resetField("password");
      if (type === "signup") {
        resetField("name");
        resetField("confirmPassword");
      }
    }
  };

  return (
    <>
      <section className="max-w-[50vw] mx-auto pt-10">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        <p className="text-center text-gray-500">{description}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          {type === "signup" && (
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
          )}
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
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          {type === "signup" && (
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="border border-gray-300 rounded-md p-2"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
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
