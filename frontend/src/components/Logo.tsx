import { Link } from 'react-router-dom'
import logo from '/swapply-nobg.png'

function Logo() {
  return (
    <Link className="flex items-center" to={'/'}>
      <img 
        src={logo} 
        alt="Swapply Logo"
        className="w-22 h-10 object-contain"
      />
    </Link>
  )
}

export default Logo
