const PostSkeleton = () => {
	return (
		<div className='flex flex-col gap-4 w-full p-4 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-lg shadow-md'>
			<div className='flex gap-4 items-center'>
				<div className='skeleton w-12 h-12 rounded-full shrink-0 bg-gradient-to-r from-green-300 to-blue-300'></div>
				<div className='flex flex-col gap-2'>
					<div className='skeleton h-2 w-16 rounded-full bg-gradient-to-r from-purple-300 to-pink-300'></div>
					<div className='skeleton h-2 w-28 rounded-full bg-gradient-to-r from-purple-300 to-pink-300'></div>
				</div>
			</div>
			<div className='skeleton h-48 w-full rounded-lg bg-gradient-to-r from-yellow-200 to-blue-200'></div>
		</div>
	);
};
export default PostSkeleton;
