interface Props extends React.HTMLAttributes<HTMLElement> {}

export const SectionContainer = ({ children, className, ...props }: Props) => {
	return <section className={` p-3  mx-auto ${className}`}>{children}</section>;
};
