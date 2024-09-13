'use client';

import Form from './form';

export default function Page({ params: { lng } }:{params: { lng: string };}) {

  return (
    <Form lng={lng} />
  );
}