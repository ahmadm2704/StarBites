import { redirect } from 'next/navigation'

export default function AdminIndexPage() {
  // Redirect to the dashboard, which will handle auth checking
  redirect('/admin/dashboard')
}
