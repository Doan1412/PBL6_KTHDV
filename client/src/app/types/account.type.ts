export interface AccountConfirmation {
  account: {
    email?: string
    password?: string
    password_confirmation?: string
  }
  user: {
    full_name?: string
    sex?: string
  }
}
