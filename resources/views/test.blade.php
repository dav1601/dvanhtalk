<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <form action="{{ route('handle.test') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
        <input type="file" name="avatar" id="">
        <input type="submit" value="upload">
    </form>
    <img src="https://drive.google.com/uc?export=view&id=0B6wwyazyzml-OGQ3VUo0Z2thdmc" alt="">
</body>

</html>
