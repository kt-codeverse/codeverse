'use client';

type Props = {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

export default function AuthButton({ label, type = 'button', onClick }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full text-white font-bold py-4 rounded-lg from-red-500 to-pink-600 bg-linear-to-r hover:opacity-90 transition duration-150"
    >
      {label}
    </button>
  );
}
