const PostSkeleton = () => {
	return (
	  <div className='flex flex-col gap-4 w-full p-4 bg-white rounded-lg shadow-md border border-gray-200'>
		<div className='flex gap-4 items-center'>
		  <div className='skeleton w-12 h-12 rounded-full shrink-0 bg-gradient-to-r from-gray-200 to-gray-300'></div>
		  <div className='flex flex-col gap-2'>
			<div className='skeleton h-2 w-24 rounded-full bg-gradient-to-r from-gray-200 to-gray-300'></div>
			<div className='skeleton h-2 w-36 rounded-full bg-gradient-to-r from-gray-200 to-gray-300'></div>
		  </div>
		</div>
		<div className='skeleton h-48 w-full rounded-lg bg-gradient-to-r from-gray-100 to-gray-200'></div>
	  </div>
	);
  };
  
  export default PostSkeleton;
  