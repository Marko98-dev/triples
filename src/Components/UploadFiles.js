const UploadFiles = () => {
    return (
        <form method="POST" enctype="multipart/form-data">
            <input type="file" name="file"/>
            <input type="submit" value="Upload"/>
        </form>
    );
}

export default UploadFiles;