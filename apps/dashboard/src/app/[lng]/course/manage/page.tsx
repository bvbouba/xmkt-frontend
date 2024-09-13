'use client';

import Form from './form';

export default function AddCoursePage({ params: { lng } }:{params: { lng: string };}) {

  return (
    <Form lng={lng}/>
  );
}