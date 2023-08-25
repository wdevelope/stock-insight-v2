// 페이지가 로드되면 실행되는 함수
window.onload = function () {
  fetch('http://localhost:3000/upload/file-url/sample.jpg') // sample.jpg는 업로드한 이미지의 파일 이름으로 변경
    .then((response) => response.text()) // 응답의 텍스트 (이미지 URL) 가져오기
    .then((url) => {
      const imgElement = document.getElementById('uploadedImage');
      imgElement.src = url; // <img> 태그의 src 속성 설정
      imgElement.style.display = 'block'; // 이미지 표시
    })
    .catch((error) => {
      console.error('Error fetching image URL:', error);
    });
};

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Successfully uploaded the file to S3');
    } else {
      console.error('Error uploading the file', await response.text());
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// const svg = d3
//   .select('body')
//   .append('svg')
//   .attr('width', width)
//   .attr('height', height);

// const xScale = d3
//   .scaleTime()
//   .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
//   .range([0, width]);

// const yScale = d3
//   .scaleLinear()
//   .domain([0, d3.max(data, (d) => d.price)])
//   .range([height, 0]);

// const line = d3
//   .line()
//   .x((d) => xScale(new Date(d.date)))
//   .y((d) => yScale(d.price));

// svg
//   .append('path')
//   .datum(data)
//   .attr('fill', 'none')
//   .attr('stroke', 'steelblue')
//   .attr('stroke-width', 1.5)
//   .attr('d', line);
