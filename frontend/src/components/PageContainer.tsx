
const PageContainer = ({children}:{children: React.ReactNode}) => {
  return (
    <div className="max-w-[1536px] px-3 py-5 mb-10 mx-auto">
      {children}
    </div>
  )
}

export default PageContainer;