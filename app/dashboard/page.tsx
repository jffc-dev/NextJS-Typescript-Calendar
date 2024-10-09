import { requireUser } from "../lib/hooks"

const DashboardPage = async() => {
    
    const session = await requireUser()
    console.log(session);

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage