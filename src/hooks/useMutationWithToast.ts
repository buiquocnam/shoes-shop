"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationWithToastConfig<TData, TVariables, TError = Error> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
  mutationOptions?: Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationFn" | "onSuccess" | "onError"
  >;
}

export function useMutationWithToast<TData, TVariables, TError = Error>(
  config: MutationWithToastConfig<TData, TVariables, TError>
) {
  const {
    mutationFn,
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    mutationOptions,
  } = config;

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        const message =
          typeof successMessage === "function"
            ? successMessage(data)
            : successMessage;
        toast.success(message);
      }
      onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      if (errorMessage) {
        const message =
          typeof errorMessage === "function"
            ? errorMessage(error)
            : errorMessage;
        toast.error(message);
      } else {
        // Default error message
        const defaultMessage =
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.";
        toast.error(defaultMessage);
      }
      onError?.(error, variables);
    },
  });
}
