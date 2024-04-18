import { ChainId, useEthers } from '@usedapp/core'
import { utils, Contract } from 'ethers'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EventContractAbi from '../../abis/EventContract.json'
import { CONTRACT_ADDRESS } from '../../constants'
import Countdown from "react-countdown";
import { QRCodeSVG } from 'qrcode.react'

function getFormObj(el) {
    const form = new FormData(el);
    const items = Array.from(form.entries()).reduce((p, [k, v]) => ({ ...p, [k]: v }), {});
    return items;
}

/**
 * 
 * @param {string} str 
 * @returns 
 */
function shorten(str) {
    if (!str) return str;
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
}
// countdown
function renderer({ days, hours, minutes, seconds, completed }) {
    if (completed) {
        return <span>Event is live</span>
    } else {
        return <span>{days && `${days} days,`} {hours && `${hours} hours,`} {minutes && `${minutes} minutes,`} {seconds && `${seconds} seconds`} remaining</span>
    }
}

const From = () => {
    const { activateBrowserWallet, deactivate, account, library, chainId } = useEthers();
    const [totalEvents, setTotalEvents] = useState([])
    const [currentEventId, setCurrentEventId] = useState(-1);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const dialogRef = useRef(null);

    /**
     * @type {typeof library extends (infer T | undefined) ? T : never }
     */
    const signer = useMemo(() => {
        if (!library) return undefined;
        return library.getSigner(account);
    }, [library, account]);

    const currentEvent = useMemo(() => {
        if (currentEventId < 0) return null;
        const evt = totalEvents?.[currentEventId];
        if (!evt) return null;
        return evt;
    }, [currentEventId, totalEvents]);

    const contract = useMemo(() => signer ? new Contract(CONTRACT_ADDRESS, new utils.Interface(EventContractAbi.abi), signer) : null, [signer])

    const reloadList = useCallback(async () => {
        if (!contract) return;
        const count = +await contract.nextId()
        const promises = []
        for (let index = 0; index < count; index++) {
            promises.push(contract.events(index))
        }
        const events = await Promise.all(promises);
        setTotalEvents(events);
    }, [contract]);

    const getTicket = useCallback(async () => {
        if (!contract || !account || currentEventId < 0) return
        const ticket = await contract.tickets(account, currentEventId);
        setCurrentTicket(ticket);
    }, [contract, account, currentEventId]);

    useEffect(() => {
        reloadList();
    }, [reloadList]);

    useEffect(() => {
        getTicket();
    }, [getTicket]);

    const createEventHandler = async (e) => {
        e.preventDefault();
        const data = getFormObj(e.target);
        const createdEvent = await contract.createEvent(data.name, +new Date(data.date), utils.parseEther(data.price), +data.count)
        if (!createdEvent) return;
        createdEvent.wait().then(reloadList);
        e.target.reset();
    }

    const buyTicketHandler = async (e) => {
        e.preventDefault();
        const data = getFormObj(e.target);
        if (data.id < 0) return;
        const evnt = totalEvents?.[+data.id]
        if (!evnt) return;
        const createdEvent = await contract.buyTicket(data.id, +data.qty, { value: evnt.price.mul(+data.qty) })
        if (!createdEvent) return;
        createdEvent.wait().then(() => {
            getTicket();
            reloadList();
        });
        e.target.reset();
    }

    const transferTicketHandler = async (e) => {
        e.preventDefault();
        const data = getFormObj(e.target);
        if (data.id < 0) return;
        const evnt = totalEvents?.[+data.id]
        if (!evnt || !currentTicket) return;
        const createdEvent = await contract.transferTicket(data.id, +data.qty, data.to)
        if (!createdEvent) return;
        createdEvent.wait().then(() => {
            getTicket();
            reloadList();
        });
        e.target.reset();
    }

    useEffect(() => {
        if (!qrCode) {
            dialogRef.current.close();
        }
        else {
            dialogRef.current.showModal();
        }
    }, [qrCode]);

    return (
        <>

            <div id='form' className='bg-[#fff] p-4' itemID=''>

                <div className="bg-[#E3FDFD] rounded-box py-6 mb-4 from">
                    {account ? <form action="#">
                        <h1 className=" text-3xl font-bold mb-6 mt-4 text-black">Address</h1>
                        {/* Name */}
                        {account}
                        <button role='button' onClick={deactivate} className="btn btn-outline ml-2 mt-2 btn-accent mb-6"> Disconnect </button>
                    </form> : <div><button role='button' className='btn btn-outline btn-accent ' onClick={activateBrowserWallet}>Connect to metamask</button></div>}
                    {chainId && chainId !== ChainId.Localhost ? <div>Invalid network</div> : null}
                </div>

                <div className='rounded-box '>
                    <div className="flex flex-col rounded-box lg:flex-row text-black from ">
                        <div className="grid flex-grow  card bg-[#E3FDFD] rounded-box place-items-center">
                            <h1 className=" text-3xl font-bold mb-6 "> Create Event</h1>
                            {/* From Start */}
                            <div className="">
                                <form onSubmit={createEventHandler}>
                                    {/* Name */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Event Name : </span>
                                        </div>
                                        <input type="text" name='name' required placeholder="Type here" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    {/* Date */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Event Date : </span>
                                            <span className="label-text text-black font-bold">Timestamp in milliseconds</span>
                                        </div>
                                        <input type="date" name='date' min={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`} required placeholder="Select Date" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    {/* Price */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Price : </span>
                                            <span className="label-text text-black font-bold"></span>
                                        </div>
                                        <input type="number" name='price' min={0.000000001} max={100} step={0.000000001} required placeholder="Add Price" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    {/*  */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Ticket Count : </span>
                                            <span className="label-text text-black font-bold"></span>
                                        </div>
                                        <input type="number" name='count' min={1} required placeholder="Insert Number" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    <button className="btn btn-outline w-full mt-2 btn-accent"> SUBMIT </button>
                                </form>
                            </div>
                            {/* Table */}
                            <div className="overflow-x-auto mt-6">
                                <h1 className=" text-3xl font-bold mb-6 mt-2 "> Event Infromations</h1>
                                <table className="table ">
                                    {/* head */}
                                    <thead>
                                        <tr className="text-black">
                                            <th></th>
                                            <th>Event Name</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Current</th>
                                            <th>Remainng</th>
                                            <th>QR</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* row 1 */}
                                        {totalEvents.map((e, i) => <tr key={i}>
                                            <th>{i}</th>
                                            <td>{e.name}</td>
                                            <td>{new Date(+e.date).toDateString()}</td>
                                            <td>{utils.formatEther(+e.price)}</td>
                                            <td>{+e.ticketCount}</td>
                                            <td>{+e.ticketRemain}</td>
                                            <td><button className="btn btn-xs btn-outline btn-accent" role='button' onClick={() => {
                                                setQrCode(`Event: #${i} ${e.name}\nDate: ${new Date(+e.date).toDateString()}\nPrice: ${utils.formatEther(+e.price)}`)
                                                //   setQrCode('https://web.whatsapp.com/')

                                            }}>QR</button></td>
                                            <td><button className="btn btn-xs btn-outline btn-accent" role='button' onClick={() => setCurrentEventId(i)}>Buy</button></td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Side DIV */}
                        <div className="divider lg:divider-horizontal text-black"></div>
                        <div className="grid flex-grow  card bg-[#E3FDFD] text-black rounded-box place-items-center">

                            {/* From Start Buy Ticket */}
                            <div className="w-80">
                                <form onSubmit={buyTicketHandler}>
                                    <h1 className=" text-3xl font-bold mb-6 "> Buy Ticket</h1>
                                    {currentEvent ? <div className="label-text text-black font-bold p-4 bg-[#fff] rounded  text-xl text-bold  "><Countdown key={currentEvent.date.toNumber()}
                                        date={new Date(currentEvent.date.toNumber())} renderer={renderer} /></div> : null}
                                    {/* Name */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold"> Ticket Id : </span>
                                        </div>
                                        <input type="text" name='id' readOnly value={currentEventId >= 0 ? currentEventId : ''} placeholder="Type here" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    {/* Date */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Ticket Quanttiy : </span>
                                        </div>
                                        <input type="number" name='qty' min={1} max={currentEvent?.ticketRemain ?? 100} placeholder="Add Quantity" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    <button className="btn btn-outline w-full mt-2 btn-accent"> SUBMIT </button>

                                </form>
                            </div>

                            {/* Buy Ticket */}
                            <div className="overflow-x-auto">
                                <h1 className=" text-3xl font-bold mb-6 mt-6 "> Ticket Infromations</h1>
                                <table className="table ">
                                    {/* head */}
                                    <thead>
                                        <tr className="text-black">
                                            <th></th>
                                            <th>Event Name</th>
                                            <th>User Id</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Quantity</th>

                                        </tr>
                                    </thead>
                                    {currentEvent && currentTicket ? <tbody>
                                        {/* row 1 */}
                                        <tr>
                                            <td></td>
                                            <td>{currentEvent.name}</td>
                                            <th>{shorten(account)}</th>
                                            <td>{new Date(+currentEvent.date).toDateString()}</td>
                                            <td>{utils.formatEther(+currentEvent.price)}</td>
                                            <td>{+currentTicket}</td>

                                        </tr>
                                    </tbody> : null}
                                </table>
                            </div>

                            {/* From Start Transfer Ticket */}
                            <div className="">
                                <form onSubmit={transferTicketHandler}>
                                    <h1 className=" text-3xl font-bold mb-6 mt-4 "> Transfer Ticket</h1>
                                    {/* Name */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold"> Event Id : </span>
                                        </div>
                                        <input type="text" name='id' readOnly value={currentEventId >= 0 ? currentEventId : ''} placeholder="Type here" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    {/* Quantity */}
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Ticket Quantity : </span>
                                        </div>
                                        <input type="number" name='qty' min={1} max={currentTicket ?? 0} placeholder="Add Quantity" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    <label className="form-control ">
                                        <div className="label">
                                            <span className="label-text text-black font-bold">Transfer To: </span>
                                        </div>
                                        <input type="text" name='to' placeholder="Address" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                                    </label>
                                    {/* Quantity */}

                                    <button className="btn btn-outline w-full mt-2 btn-accent"> SUBMIT </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* <div>
                    <div className="bg-[#CBF1F5] p-10 rounded-xl mt-6">
                        <form>
                            <h1 className=" text-3xl font-bold mb-6 mt-4 text-black"> Ticket Check</h1>
                            <select className="select select-accent w-full max-w-xs mt-2 bg-[#CBF1F5] text-black">
                                <option disabled selected>Select Address</option>
                                <option>Address 01 </option>
                                <option>Address 02 </option>
                                <option>Address 03 </option>
                            </select>
                            <label className="form-control w-80 m-auto ">
                                <div className="label">
                                    <span className="label-text text-black font-bold"> Ticket Id : </span>
                                </div>
                                <input type="text" placeholder="Type here" className="input input-bordered input-accent bg-[#CBF1F5] text-black" />
                            </label>
                            <button className="btn btn-outline w-80 m-auto mt-2 btn-accent mb-6"> Check </button>
                        </form>
                        <label className="text-2xl text-black font-bold" htmlFor=""> Number Of Ticket : <span>00</span> </label>
                    </div>

                </div> */}
                </div>

                <dialog ref={dialogRef} className='backdrop:bg-black backdrop:opacity-60'>
                    <button role='button' className='btn btn-circle btn-outline fixed right-4 top-4' onClick={() => setQrCode(null)}>&times;</button>
                    {qrCode ? <QRCodeSVG value={qrCode} className='bg-white p-16' width={600} height={600} /> : null}
                </dialog>
            </div>

        </>
    )


}

export default From;