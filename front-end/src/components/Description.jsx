import React, { useState } from 'react'

const Description = () => {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className='px-6 md:px-0'>
      {/* Tabs header */}
      <div className='flex'>
        <button
          onClick={() => setActiveTab("description")}
          className={`border border-gray-400 font-semibold p-4
            ${activeTab === "description"
              ? "bg-black text-white"
              : "bg-transparent text-gray-400"
            }`}
        >
          Description
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`border border-l-0 border-gray-400 font-semibold p-4
            ${activeTab === "reviews"
              ? "bg-black text-white"
              : "bg-transparent text-gray-400"
            }`}
        >
          Reviews (122)
        </button>
      </div>
      {/* Tab content */}
      <div className='border border-gray-400 p-8'>
        {activeTab === "description" && (
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
            quisquam saepe vero, accusantium similique sed eligendi consequuntur
            magni dolores, quam quod minus unde possimus numquam harum, amet
            necessitatibus sunt deleniti autem non nobis cumque debitis!
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
            voluptates optio provident ipsa laborum cupiditate, libero deserunt
            neque veritatis.
          </p>
        )}

        {activeTab === "reviews" && (
          <p>
            ⭐⭐⭐⭐☆ <br /><br />
            This product is amazing!  
            <br />
            122 customer reviews go here...
          </p>
        )}
      </div>
    </div>
  )
}

export default Description
