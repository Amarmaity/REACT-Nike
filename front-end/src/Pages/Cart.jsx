import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { X } from 'lucide-react'
import EmptyCart from '../assets/EmptyCart.png'
import { Link } from 'react-router-dom'

const Cart = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { getTotalCartItems, all_product, cartItems, removeFromCart, getTotalCartAmount } = useContext(ShopContext)

  return (
    <div>
      <div className='max-w-7xl mx-auto my-10 p-4'>
        {getTotalCartItems() === 0 ? <div className='flex items-center justify-center'><img src={EmptyCart} alt='' /></div> : <div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[0.5fr,2fr,1fr,1fr,1fr,1fr] items-center px-4 text-foreground'>
            <p>Products</p>
            <p>Title</p>
            <p className='hidden md:block'>Price</p>
            <p className='hidden md:block'>Quantity</p>
            <p className='hidden md:block'>Total</p>
            <p className='hidden md:block'>Remove</p>
          </div>
          <hr className='bg-gray-700 border-0 h-[2px] my-2' />
          {all_product.map((e) => {
            if (cartItems[e.id] > 0) {
              return (
                <div key={e.id}>
                  <div className='text-gray-300 font-semibold text-sm sm:text-base grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[0.5fr,2fr,1fr,1fr,1fr,1fr] items-center px-4 gap-2'>
                    <img src={e.image} className='h-16 w-16 object-cover' alt="" />
                    <p>{e.name}</p>
                    <p className='hidden md:block'>${e.new_price}</p>
                    <button className='w-16 h-12 bg-gray-800 border border-gray-700 text-foreground'>{cartItems[e.id]}</button>
                    <p className='hidden md:block'>${e.new_price * cartItems[e.id]}</p>
                    <X onClick={() => { removeFromCart(e.id) }} className='cursor-pointer text-gray-400 hover:text-red-400' />
                  </div>
                  <hr className='bg-gray-700 border-0 h-[2px] my-2'/>
                </div>
              )
            }
            return null;
          })}
          <div className='flex flex-col lg:flex-row my-12 gap-10 md:gap-32'>
            <div className='flex-1 flex flex-col gap-4'>
              <h1 className='text-lg font-bold text-foreground'>Cart Totals</h1>
              <div>
                <div className='flex justify-between py-2 text-gray-300'>
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr className='bg-gray-700 border-0 h-[2px] my-2'/>
                <div className='flex justify-between py-2 text-gray-300'>
                  <p>Shipping Fee</p>
                  <p>Free</p>
                </div>
                <hr className='bg-gray-700 border-0 h-[2px] my-2'/>
                <div className='flex justify-between text-xl font-semibold py-2 text-foreground'>
                  <h3>Total</h3>
                  <h3>${getTotalCartAmount()}</h3>
                </div>
              </div>
              <Link to='#'>
              <button className='w-full lg:w-64 h-14 bg-[#138695] text-white font-semibold text-lg hover:bg-[#0f6d7a] transition-colors'>PROCEED TO CHECKOUT</button>
              </Link>
            </div>
            <div className='flex-1 w-full text-lg font-semibold'>
              <p className='text-gray-400'>If you have a promo code, enter it here:</p>
              <div className='w-full lg:w-80 mt-2 flex'>
                <input type="text" placeholder='Promo code' className='flex-1 h-14 p-2 bg-gray-800 border border-gray-700 text-foreground placeholder-gray-500 focus:outline-none focus:border-[#138695]'/>
                <button className='h-14 w-32 px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white transition-colors'>Submit</button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default Cart
