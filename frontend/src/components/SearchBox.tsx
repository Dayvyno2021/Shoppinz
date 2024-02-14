import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword('');
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  }

  return (
    <form onSubmit={submitHandler} className='flex'>
        {/* <label htmlFor="fn" className=''></label> */}
        <input type="search" id='fn' placeholder='Search' autoComplete='false' className='remove__border w-[300px] xl:w-[500px] px-1'
          value={keyword}
          onChange={(e)=>setKeyword(e.target.value)}
        />
      <button type='submit' className="custom__btn">
        <FaSearch className="fill-neutral-200 hover:fill-white"/>
      </button>
    </form>
  )
}

export default SearchBox