import React from 'react'

const OrderStatus = ({order, classname=""}) => {

    const getStatus = () => {
        if(order?.isShipped && !order?.isDelivered){
          return { status: 'Shipped', bgColor: 'bg-blue-200', textColor: 'text-blue-700' }
        }else if(order?.isDelivered && order?.isShipped){
          return { status: 'Delivered', bgColor: 'bg-green-200', textColor: 'text-green-700' };
        }else{
          return { status: 'In Process', bgColor: 'bg-orange-200', textColor: 'text-orange-700' }
        }
      }

      const { status, bgColor, textColor } = getStatus()

  return (
    <span className={`mt-3 text-xs font-medium ${textColor} ${bgColor} p-2 rounded-full select-none ${classname}`}>
    {status}
  </span>
  )
}

export default OrderStatus