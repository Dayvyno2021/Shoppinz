import React from 'react';
import { Listbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid';
// import { ProductType } from '@/types';
import Rating from './Rating';
import { UserType } from '@/redux/slices/authSlice';
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from 'react-router-dom';
import { ProductType } from '@/redux/types/productTypes';

type RatingProps = { id: string, name: string }

type ReviewComponentProps = {
  product: Partial<ProductType>,
  userInfo: UserType,
  submitHandler: React.FormEventHandler<HTMLFormElement>,
  rating: RatingProps,
  onChangeHandler: (val: RatingProps) => void,
  ratingValues: RatingProps[],
  comment: string,
  onCommentChange: React.ChangeEventHandler<HTMLTextAreaElement>,
  loadingProductReview: boolean
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({
  product, userInfo, submitHandler, rating, onChangeHandler, ratingValues, comment, onCommentChange, loadingProductReview
}) => {
  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <h5 className="font-semibold text-lg w-full text-center bg-neutral-200 py-2 px-4">Reviews</h5>
        <div className="flex flex-col gap-3">
          {
            product?.reviews?.length ? (
              product?.reviews?.map((review, i) => (
              <div key={Math.random() + i} className="flex flex-col gap-1 bg-neutral-100 rounded p-2">
                <p className="font-bold"> {review?.name} </p>
                <Rating value={review?.rating!} />
                <p className=""> {review?.comment} </p>
                <p className=""> {review?.createdAt?.substring(0, 10)} </p>
              </div>
            ))
            ) : (
                <p className="bg-blue-100 px-4 py-2 rounded">No Reviews</p>
            )
          }
        </div>
      </div>
      <div className="flex flex-col gap-5 w-full mt-5">
        <h5 className="font-semibold text-lg w-full text-center bg-neutral-200 py-2 px-4">Write a Customer Review</h5>
        {
          userInfo?._id ? (
            <form onSubmit={submitHandler}  className="flex flex-col gap-3">
              <div className="flex flex-col">
                <label htmlFor='rating' className='font-medium'>Rating</label>
                <Listbox value={rating} onChange={onChangeHandler}>
                  <Listbox.Button id='rating' className={"remove__border"}>
                    <p className="bg-green-400 w-full py-2 px-4 flex justify-between items-center">
                      <span> {rating.name} </span>
                      <IoMdArrowDropdown className=''/>
                    </p>
                  </Listbox.Button>
                  <Listbox.Options>
                    {ratingValues.map((person) => (
                      /* Use the `active` state to conditionally style the active option. */
                      /* Use the `selected` state to conditionally style the selected option. */
                      <Listbox.Option key={person.id} value={person} as={React.Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`flex justify-between ${ 
                              active ? 'bg-green-200 text-white' : 'bg-neutral-100 text-black'
                            }`}
                          >
                            <span>{person.name}</span>
                            <span>{selected && <CheckIcon className='w-5 h-5 mr-2' />}</span>
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>

              <div className="flex flex-col">
                <label htmlFor="comment">Comment</label>
                <textarea
                  className='border p-2 border-green-400 focus:border-green-500 focus:outline-none'
                  id="comment" name="comment" rows={3} cols={50}
                  value={comment}
                  onChange={onCommentChange}
                  placeholder='Product perception...'
                />
              </div>

              <button type='submit' disabled={loadingProductReview} className="custom__btn">
                Submit
              </button>

            </form>
          
          ) : (
              <p className="bg-blue-200 px-4 py-2">
                Please <Link to='/login' className='text-green-500 hover:text-green-600'>sign in</Link> to write a review {' '}
              </p>
          )
        }
      </div>
    </>
  )
}

export default ReviewComponent