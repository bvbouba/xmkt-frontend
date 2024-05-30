export const formatDate = (datetimeString:string) => {
    const date = new Date(datetimeString);
    return date.toISOString().split('T')[0];
  };

  export default formatDate