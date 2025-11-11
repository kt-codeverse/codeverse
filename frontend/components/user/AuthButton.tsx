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
      className="w-full text-white font-bold py-4 rounded-lg bg-gradient-to-r/ from-red-500 to-pink-600 hover:opacity-90 transition duration-150"
    >
      {label}
    </button>
  );
}
