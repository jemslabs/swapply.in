import { Link } from 'react-router-dom'
import logo from '/swapply-nobg.png'

function Logo() {
  return (
    <Link className="flex items-center" to={'/'}>
      <img 
        src={logo} 
        alt="Swapply Logo"
        className="w-8 h-8 object-contain"
      />
      <span className="text-lg font-semibold ">Swapply</span>
    </Link>
  )
}

export default Logo
