const DownloadTsObject = (objectToDownload: any) => {
    const tsContent = `${JSON.stringify(objectToDownload, null, 2)}`;
  
    const blob = new Blob([tsContent], { type: 'text/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dataAssets.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
  
export default DownloadTsObject;