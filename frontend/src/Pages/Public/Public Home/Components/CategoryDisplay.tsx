type CategoryCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
};

const Categorydisplay = ({
  title,
  description,
  icon,
  imageSrc,
}: CategoryCardProps) => {
  return (
    <div className="category-card h-64 relative overflow-hidden card-hover">
      <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      <div className="category-overlay absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
        <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
          {icon}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-sm opacity-90 mt-1 text-center">{description}</p>
      </div>
    </div>
  );
};

export default Categorydisplay;
