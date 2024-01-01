import { useUserStore } from 'stores/user'
import router from '.'

export async function authGuard(to, from, next) {
  const useUser = useUserStore()
  if (!useUser.user) await useUser.get() // for first browse navigation
  if (useUser.user) next()
  else next('/login')
}

// protects route for users who are logged in and go to login pages
export async function authNone() {
  const useUser = useUserStore()
  if (!useUser.user) await useUser.get()
  if (useUser.user) router.push('/account')
}
