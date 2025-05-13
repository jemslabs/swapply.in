import { Button } from '@/components/ui/button'
import { useAuth } from '@/stores/useAuth'
import { useState } from 'react'

function Signup() {
    const {login} = useAuth()
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await login(data)
    }
  return (
    <div>
        <form onSubmit={handleSignup}>
            <label>Name</label>
            <input value={data?.name} onChange={(e)=>setData({...data, name: e.target.value})}/>
            <label>Email</label>
            <input value={data?.email} onChange={(e)=>setData({...data, email: e.target.value})}/>
            <label>Password</label>
            <input value={data?.password} onChange={(e)=>setData({...data, password: e.target.value})}/>
            <Button>Save</Button>
        </form>
    </div>
  )
}

export default Signup