import React from "react";
import { Helmet } from "react-helmet-async";

type MetaProps = {
  title?: string,
  description?: string,
  keywords?: string,
}

const Meta:React.FC<MetaProps> = ({title, description, keywords}) => {
  return (
    <Helmet>
      <title> {title} </title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords}/>
    </Helmet>
  )
}

Meta.defaultProps = {
  title: "Welcome to Shoppinz",
  description: "We sell the best products for cheap",
  keywords: 'electronics, buy electronics, cheap electronics'
}
export default Meta;