<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;

        }
    </style>
    {{-- <form action="{{ route('handle.test') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
        <input type="file" name="avatar" id="">
        <input type="submit" value="upload">
    </form> --}}
    {{-- <img src="https://drive.google.com/uc?export=view&id=0B6wwyazyzml-OGQ3VUo0Z2thdmc" alt=""> --}}

    <video width="600" height="500" controls>
        <source src="https://drive.google.com/uc?export=download&id=1pWV5doI6NgENTMifZYm8o11UkbC47t3O" type="video/mp4" >
    </video>

</body>

</html>
