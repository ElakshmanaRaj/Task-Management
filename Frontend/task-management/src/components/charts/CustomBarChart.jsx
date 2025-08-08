import React from 'react';
import { Tooltip, Legend, Cell, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

const CustomBarChart = ({data}) => {

    const getBarColor = (entry)=>{
        switch (entry?.priority) {
            case "Low":
                return "#00BC7D"
            case "Medium":
                return "#FE9900"
            case "High":
                return "#FF1F57"
            default:
                return "#000c7D"
        }
    }

    const CustomTooltip = ({active,payload}) => {
        if(active && payload && payload.length){
      return (
        <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
            <p className='text-xs font-semibold mb-1 text-purple-800'>{payload[0].payload.priority}</p>
            <p className='text-sm text-gray-600'>Count: <span className='text-sm font-medium text-gray-900'>{payload[0].payload.count}</span></p>
        </div>
      );
    }
    
    return null;
    }
  return (
    <div className='bg-white mt-6'>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid stroke='none'/>
                <XAxis dataKey="priority" stroke='none' tick={{fontSize:12, fill: "#555"}} />
                <YAxis stroke='none' tick={{fill: "#555", fontSize:12}}/>
                <Tooltip content={CustomTooltip} cursor={{fill:"transparent"}}/>
                <Bar dataKey="count" 
                nameKey="priority" 
                fill='#FF8042'
                radius={[10, 10, 0, 0]}
                activeStyle={{fill:"green"}}
                activeDot={{fill:"yellow", r:8}}>
                    {data.map((entry, index)=>(
                        <Cell key={index} fill={getBarColor(entry)}/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart;