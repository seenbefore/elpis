<!DOCTYPE html>
<html>
<head>
  <title>{{name}}</title>
  <link rel="stylesheet" href="/static/normalize.css">
  <link rel="icon" href="/static/logo.png" type="image/x-icon">
</head>
<body style="color: blue;">
  <h1>Page1</h1>
  <input id="env" value="{{ env }}" style="display: none">
  <input id="options" value="{{ options }}" style="display: none">
  <button onClick="handleClick()">发送请求</button>
</body>
<script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
<script type="text/javascript">
  try {
    window.env = document.getElementById('env').value;
    const options = document.getElementById('options').value;
    window.options = JSON.parse(options);
  } catch (e) {
    console.log(e);
  }
  const handleClick = () => {
    const signKey = 'gwqbiudniueahewfuieuwddncaadsjk';
    const st = Date.now();
    axios.request({
      method: 'get',
      url: '/api/project/list',
      params: { proj_key: 1 },
      headers: {
        s_t: st,
        s_sign: md5(`${signKey}_${st}`)
      }
    })
    // axios.get('/api/project/list').then(res => console.log('res', res));
  }
</script>
</html>