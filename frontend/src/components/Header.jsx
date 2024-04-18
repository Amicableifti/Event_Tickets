const Header = () => {

    return (
        <>
            <div className="navbar bg-[#000] text-white w-full">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>About Us</a></li>
                            <li><a>Services</a></li>
                            <li><a>Steps</a></li>
                            <li><a>Blog</a></li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl text-[#4AC4C3] "> <img className=" w-14 " src="logo.png" alt="" /> </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a>About Us</a></li>
                        <li><a>Services</a></li>
                        <li><a>Steps</a></li>
                        <li><a>Blog</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <a href="#form" className="btn bg-[#fff] text-black border-0 ">Buy Ticket</a>
                </div>
            </div>
        </>
    )
}

export default Header;