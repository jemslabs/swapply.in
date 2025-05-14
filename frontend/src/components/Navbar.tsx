
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  return (
    <div className="bg-[#000000] border border-[#3a3a3a] rounded-xl my-3 py-2 px-3 w-[1200px] mx-auto">
      <div className='flex justify-between items-center'>


        <Logo />

        <div className='flex gap-2'>
          <Link to={'/login'}>
            <Button>Login</Button>
          </Link>
          <Link to={'/signup'}>
            <Button variant={'outline'}>Signup</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar