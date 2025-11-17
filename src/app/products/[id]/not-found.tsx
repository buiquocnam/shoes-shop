import Link from "next/link";

const NotFound = () => {    
    return (
        <div className="flex flex-col items-center justify-center h-screen">

                <h1 className="text-2xl font-bold">Product not found</h1>
                <p className="text-gray-500">The product you are looking for does not exist.</p>
                <Link href="/" className="text-blue-500 hover:text-blue-600">Go back to home</Link>
        </div>
    );
}

export default NotFound;