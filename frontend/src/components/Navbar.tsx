
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import Logo from './Logo'

function Navbar() {
  return (
    <div className="bg-[#000000] border rounded-xl my-3 p-3 w-[1200px] mx-auto">
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