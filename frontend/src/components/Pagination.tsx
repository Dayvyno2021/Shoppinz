// import React from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';

interface PaginateProps extends ReactPaginateProps{
  val: number
}

const Pagination = ({onPageChange, pageCount, val}:PaginateProps) => {
  return (
    <div className="flex justify-center my-5">
      {
        pageCount > 1? (
          <ReactPaginate
            breakLabel="..."
            className='flex gap-2'
            nextLabel="next >"
            onPageChange={onPageChange}
            pageRangeDisplayed={5}
            pageCount={pageCount} 
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName=''
            nextClassName={`${pageCount === val ? "text-neutral-300":"text-green-400 hover:text-green-500"} `}
            previousClassName={`${val <= 1 ? "text-neutral-300" : "text-green-400 hover:text-green-500"}`}
            activeLinkClassName = 'bg-green-400 px-2 rounded'
          />
        ):('')
      }
    </div>
  )
}

export default Pagination