export { AuthProvider, useAuth } from './providers/auth-provider';
export { GuestRoute, PermissionGuard, ProtectedRoute, RoleGuard } from './components/auth-guards';
export {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  type ChangePasswordFormValues,
  type LoginFormValues,
  type RegisterFormValues,
} from './schemas/auth.schemas';
export {
  useChangePasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRegisterMutation,
} from './hooks/use-auth-mutations';
