const Banner = () => {
    return (
        <>
            <div className="hero py-4 bg-base-200 bg-[#E3FDFB]">
                <div className="hero-content flex-col lg:flex-row-reverse ">
                    <img src="banner.png" className="max-w-lg rounded-lg 
                    " />
                    <div className="text-left pr-8">
                        <h1 className="text-4xl font-bold">Blockchain Summit Ticket Sale</h1>
                        <p className="py-6 text-xl "> Unlock the future of finance at our exclusive blockchain event! Limited tickets available. Secure your spot now and join us!"</p>
                        <div>
                            <div>
                                <ul>
                                    <li> <div className="flex items-center py-1"> <img className="w-6 mr-2" src="diamond.png" alt="" /> <p className="">Exclusive access to top-tier speakers</p></div></li>
                                    <li> <div className="flex items-center py-1"> <img className="w-6 mr-2" src="focus.png" alt="" /> <p className="">Hands-o workshops and demonstrationsn</p></div></li>
                                    <li> <div className="flex items-center py-1"> <img className="w-6 mr-2" src="blockchain.png" alt="" /> <p className="">Networking opportunities with industry pioneers</p></div></li>
                                </ul>
                            </div>
                        </div>
                        <button className="btn bg-[#4AC4C3] text-white text-2xl border-0 px-4 mt-5 mb-2"> <a href="#form"> Buy Tickets Now</a></button>
                        <div className="flex">
                            <div>
                                <div class="rating rating-sm">
                                    <input type="radio" name="rating-6" class="mask mask-star-2 bg-accent" />
                                    <input type="radio" name="rating-6" class="mask mask-star-2 bg-accent" />
                                    <input type="radio" name="rating-6" class="mask mask-star-2 bg-accent" />
                                    <input type="radio" name="rating-6" class="mask mask-star-2 bg-accent" checked />
                                    <input type="radio" name="rating-6" class="mask mask-star-2 bg-accent" />
                                </div>
                            </div>
                            <div className="ml-2"> Reviews</div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  */}


            <div className=" px-40 py-10 bg-[#4AC4C3]">
                <div>
                    <h1 className="text-4xl font-bold py-4 text-white text-center" >Buy Tickets Using Our Website</h1>
                    <p className="mb-6 text-center text-white ">Limited tickets available. Don't miss out, reserve yours today!</p>
                </div>
                <div className="flex gap-6  ">
                    <div>
                        <img src="img2.png" alt="" />
                    </div>
                    <div>
                        <img src="img3.png" alt="" />
                    </div>
                    <div>
                        <img src="img1.png" alt="" />
                    </div>
                </div>
            </div>

            <div className="hero py-6 bg-base-200 bg-[#fff]">
                <div className="hero-content flex-col lg:flex-row ">
                    <img src="left_image.png" className="max-w-xl rounded-lg 
                    " />
                    <div className="text-left p-6">
                        <h1 className="text-4xl font-bold mb-4">Tickets Selling Fast</h1>
                        <div className="py-2">
                            <div>
                                <ul>
                                    <li> <div className="flex items-center py-1"> <img className="w-6 mr-2" src="../public/diamond.png" alt="" /> <p className="">Exclusive access to top-tier speakers</p></div></li>
                                    <li> <div className="flex items-center py-1"> <img className="w-6 mr-2" src="../public/focus.png" alt="" /> <p className="">Hands-o workshops and demonstrationsn</p></div></li>
                                    <li> <div className="flex items-center py-1"> <img className="w-6 mr-2" src="../public/blockchain.png" alt="" /> <p className="">Networking opportunities with industry pioneers</p></div></li>
                                </ul>
                            </div>
                        </div>
                        <p className="py-4 pb-8">Secure your spot for an exclusive evening of entertainment! Limited tickets available. Don't miss out, reserve yours today!</p>
                        <div>
                            <ul className="steps steps-vertical lg:steps-horizontal ">
                                <li className="step step-accent">Connect</li>
                                <li className="step step-accent">Choose Event</li>
                                <li className="step">Purchase</li>
                                <li className="step">Transfter</li>
                            </ul>
                        </div>

                        {/* <button className="btn bg-[#4AC4C3] text-white text-2xl border-0 px-4 mt-5">Buy Tickets Now</button> */}
                    </div>
                </div>
            </div>


            {/*  */}

        </>
    )
}

export default Banner;