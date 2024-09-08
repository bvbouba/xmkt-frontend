'use client';

import Form from "../form";


export default function EditCoursePage({ params: { lng,id } }:{params: { lng: string, id:number };}) {
  
  return (
    <Form lng={lng} id={id} />
  );
}