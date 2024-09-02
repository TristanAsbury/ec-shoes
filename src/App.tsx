import { BiCart, BiMinus, BiPlus } from 'react-icons/bi'
import './App.css'
import { GiHamburgerMenu } from 'react-icons/gi'
import { HTMLProps, useEffect, useRef, useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { CgClose } from 'react-icons/cg'

interface PopoverProps extends HTMLProps<HTMLDivElement> {
  targetRef: React.RefObject<HTMLDivElement>,
  isOpen: boolean
}

const Popover: React.FC<PopoverProps> = ({ targetRef, isOpen, ...props }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const calculatePosition = () => {
    if (isOpen && targetRef.current && popoverRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      let top = targetRect.bottom;
      let left = targetRect.left;

      // Adjust for potential off-screen issues
      if (left + popoverRect.width > window.innerWidth) {
        left = window.innerWidth - popoverRect.width - 30;
      }
      if (top + popoverRect.height > window.innerHeight) {
        top = window.innerHeight - popoverRect.height - 30;
      }

      console.log(`Target pos`, targetRef.current.getBoundingClientRect());
      console.log(`Popover pos`, popoverRef.current.getBoundingClientRect());

      setPosition({ top, left });
    } else {
      console.log("Not open or there isnt one of the refs");
      
    }
  };

  useEffect(() => {
    calculatePosition();
  }, [isOpen, targetRef]);

  return (
    isOpen && (
      <div
        ref={popoverRef}
        style={{ top: position.top, left: position.left, zIndex: 1000 }}
        className="absolute bg-white shadow-lg p-4 rounded z-20 transition-all duration-300"
      >
        {props.children}
      </div>
    )
  );
};

interface NavBarProps extends HTMLProps<HTMLDivElement> {
  onMenuPress: () => void,
  cartRef: React.RefObject<HTMLDivElement>
}

const NavMenu: React.FC<NavBarProps> = ({onMenuPress, cartRef, ...props}) => {

  const [isOpen, setOpen] = useState(false);

  return (
    <nav {...props} className='w-full flex flex-row justify-between bg-white p-8 sticky top-0 z-20'>
        {/* LEFT SIDE */}
        <div className="flex flex-row min-w-0 items-center gap-4">
          <button className="sm:hidden" onClick={() => onMenuPress()}><GiHamburgerMenu size={28}></GiHamburgerMenu></button>
          <button className="flex-shrink-0">
            <p className="font-header font-bold text-3xl">SNEAKERS</p>
          </button>
          <div className="hidden md:block">
            <a href="" className="text-ec-dark-gray-blue hover:text-ec-very-dark-blue font-base text-xl transition-all rounded-lg px-4 py-2">Collections</a>
            <a href="" className="text-ec-dark-gray-blue hover:text-ec-very-dark-blue font-base text-xl transition-all rounded-lg px-4 py-2">Men</a>
            <a href="" className="text-ec-dark-gray-blue hover:text-ec-very-dark-blue font-base text-xl transition-all rounded-lg px-4 py-2">Women</a>
            <a href="" className="text-ec-dark-gray-blue hover:text-ec-very-dark-blue font-base text-xl transition-all rounded-lg px-4 py-2">About</a>
            <a href="" className="text-ec-dark-gray-blue hover:text-ec-very-dark-blue font-base text-xl transition-all rounded-lg px-4 py-2">Contact</a>
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <div ref={cartRef}>
            <button onClick={() => setOpen(!isOpen)} className="h-8 w-8"><BiCart className="h-full w-full"></BiCart></button>
          </div>
          <Popover targetRef={cartRef} isOpen={isOpen}>
            <div className="p-4 min-w-52">
              <h3 className="font-base text-left">Cart <b>(3)</b></h3>
            </div>
          </Popover>
          <button className="h-8 w-8"><img src="/images/image-avatar.png" alt=""/></button>
        </div>
      </nav>
  )
}

interface SlideshowProps extends HTMLProps<HTMLDivElement> {
  imgs: string[]
}

const SlideShow: React.FC<SlideshowProps> = ({imgs, ...props}) => {

  const [numImgs] = useState(imgs.length);
  const [currentImage, setCurrentImage] = useState(0);
  const slideShowRow = useRef<HTMLDivElement>(null);
  const slideShowWindow = useRef<HTMLDivElement>(null);

  const goNext = () => {
    if (slideShowRow.current) {
      const nextImage = currentImage + 1 < imgs.length ? currentImage + 1 : 0;
      slideShowRow.current.style.transform = `translateX(${-100 * (nextImage)}%)`;
      setCurrentImage(nextImage);
    }
  };

  const goBack = () => {
    if (slideShowRow.current) {
      const nextImage = currentImage - 1 >= 0 ? currentImage - 1 : numImgs - 1;
      slideShowRow.current.style.transform = `translateX(${-100 * (nextImage)}%)`;
      setCurrentImage(nextImage);
    }
  }

  const goToImage = (index: number) => {
    if(slideShowRow.current){
      setCurrentImage(index);
      slideShowRow.current.style.transform = `translateX(${-100 * (index)}%)`;
    }
  }

  return (
    <div {...props} className="relative h-fit overflow-hidden z-10">
      <div ref={slideShowWindow} className="md:rounded-xl overflow-hidden">
        <div ref={slideShowRow} className="flex flex-row w-full transition-all ease duration-500">
          {
            imgs.map((img, index) => {
              return (
                <img className="min-w-full" src={img} key={index}>
                </img>
              )
            })
          }
        </div>
      </div>
      

      {/* ARROWS FOR MOBILE */}
      <div className="md:hidden w-[90%] absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex flex-row justify-between">
        <button onClick={() => goBack()} className='p-4 bg-white rounded-full w-fit'>
          <BsArrowLeft strokeWidth={1}></BsArrowLeft>
        </button>

        <button onClick={() => goNext()} className='p-4 bg-white rounded-full w-fit'>
          <BsArrowRight strokeWidth={1}></BsArrowRight>
        </button>
      </div>
      
      {/* ROW OF IMAGES FOR DESKTOP */}
      <div className="w-full py-4 hidden md:block overflow-scroll px-2">
        <div className="flex flex-row gap-4">
          {
            imgs.map((img, index) => {
              return (
                <button key={index} className={`min-w-24 w-24 relative rounded-lg overflow-hidden ${index == currentImage ? 'outline outline-2 outline-ec-orange' : ''}`} onClick={() => goToImage(index)}>
                  <div className={`absolute w-full h-full transition-all duration-200 ${index === currentImage ? 'bg-white/10' : 'bg-black/30'}`}></div>
                  <img className="" src={img}></img>
                </button>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function App() {
  const imgs = [
    './images/image-product-1.jpg',
    './images/image-product-2.jpg',
    './images/image-product-3.jpg',
    './images/image-product-4.jpg',
    './images/image-product-1.jpg',
    './images/image-product-2.jpg',
    './images/image-product-3.jpg',
    './images/image-product-4.jpg',
  ]

  const slideShowRow = useRef<HTMLDivElement>(null);
  const sideMenu = useRef<HTMLDivElement>(null);
  const cartIcon = useRef<HTMLDivElement>(null);

  const [currentCount, setCurrentCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const counterUp = () => {
    const nextCounter = currentCount + 1;
    setCurrentCount(nextCounter);
    if (slideShowRow.current) {
      slideShowRow.current.style.transform = `translateX(${-100 * nextCounter}%)`;
    }
  };

  const counterDown = () => {
    if (currentCount > 0) {
      const prevCounter = currentCount - 1;
      setCurrentCount(prevCounter);
      if (slideShowRow.current) {
        slideShowRow.current.style.transform = `translateX(${-100 * prevCounter}%)`;
      }
    }
  };

  const toggleNavMenu = () => {
    console.log(menuOpen ? 'Closing' : 'Opening');
    if (menuOpen) {
      document.body.style.overflow = 'scroll';
      setMenuOpen(false);
    } else {
      document.body.style.overflow = 'hidden';
      setMenuOpen(true);
    }
  };

  return (
    <div className="relative">
      {/* SIDE MENU */}
      <div className="w-full h-full">
        {/* BACKDROP */}
        {
        menuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 transition-all duration-100"
            onClick={toggleNavMenu}>
          </div>
        )}

        {/* THE SLIDING MENU */}
        <div
          ref={sideMenu}
          className="fixed left-0 top-0 w-2/3 h-full bg-white flex flex-col items-start px-8 py-4 gap-8 transition-transform duration-500 z-30"
          style={{ transform: menuOpen ? 'translateX(0%)' : 'translateX(-100%)' }}
        >          
        <button className="" onClick={() => toggleNavMenu()}><CgClose strokeWidth={1.5} size={24}></CgClose></button>
          <div className="bg-white flex flex-col gap-4 items-start">
            <a className="font-base font-bold text-2xl">Collections</a>
            <a className="font-base font-bold text-2xl">Men</a>
            <a className="font-base font-bold text-2xl">Women</a>
            <a className="font-base font-bold text-2xl">About</a>
            <a className="font-base font-bold text-2xl">Contact</a>
          </div>
        </div>
      </div>
      <NavMenu cartRef={cartIcon} onMenuPress={() => toggleNavMenu()}></NavMenu>
      
      <div className="flex flex-col md:flex-row">
        <div className='mt-2 md:mt-0 md:p-8 md:w-1/2'>
          <SlideShow imgs={imgs}></SlideShow>
        </div>

        <div className="flex flex-col gap-2 p-8 md:p-16 items-start srhink md:w-1/2">
          <p className="font-base font-bold text-neutral-600">SNEAKER COMPANY</p>
          <h1 className="font-header text-4xl text-left">Fall Limited Edition Sneakers</h1>
          <p className="font-base text-neutral-600 text-left pt-4">These low profile sneakers are perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.</p>
        
          <div className="flex flex-row font-base font-bold items-center justify-between w-full mt-4 md:flex-col md:items-start">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-2xl">$125.00</p>
              <p className="rounded-lg px-2 bg-black text-white">50%</p>
            </div>
            <p className="line-through text-neutral-600">$250</p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-4 w-full items-center mt-4">
            <div className="mt-4 md:mt-0 overflow-hidden bg-ec-light-gray-blue w-full flex flex-row justify-between items-center p-4 rounded-lg">
              <button onClick={() => counterDown()} className="text-ec-orange hover:scale-110 transition-all"><BiMinus strokeWidth={2} size={26}></BiMinus></button>
              <div className='w-full h-full overflow-hidden'>
                <div className="flex flex-row text-xl font-header font-bold transition-all duration-500 ease-in-out" ref={slideShowRow}>
                {Array.from({ length: currentCount + 2 }, (_, i) => (
                  <p key={i} className="min-w-full">{i}</p>
                ))}
                </div>
              </div>
              <button onClick={() => counterUp()} className="text-ec-orange hover:scale-110 transition-all"><BiPlus strokeWidth={2} size={26}></BiPlus></button>
            </div>

            <button className="mt-2 md:mt-0 sm:min-w-2/3 text-nowrap flex flex-row items-center justify-center w-full rounded-lg bg-ec-orange p-4 text-xl font-base font-bold gap-4 text-ec-very-dark-blue hover:scale-[103%] transition-all">
              <BiCart></BiCart>
              <p>Add to Cart</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
