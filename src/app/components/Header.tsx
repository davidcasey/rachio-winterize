import Link from 'next/link';
// import { MdHomeFilled } from 'react-icons/md';
// import { MdInfo } from 'react-icons/md';

// import MenuItem from 'app/components/MenuItem';

export default function Header() {
  return (
    <div className='flex justify-between items-center p-3 max-w-6xl mx-auto'>
      <div className="flex gap-4">
        {/* <MenuItem title="Home" address="/" Icon={MdHomeFilled} />
        <MenuItem title="About" address="/about" Icon={MdInfo} /> */}
      </div>
      <div className='flex items-center gap-4'>
        <Link href={'/'} className='flex gap-1 items-center'>
          <span className='text-2xl font-bold bg-amber-500 py-1 px-2 rounded-lg'>Guitar</span>
          <span className='text-xl hidden sm:inline'>Notes</span>
        </Link>
      </div>
    </div>
  )
}
