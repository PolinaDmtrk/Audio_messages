export async function getData() {
    const response = $.ajax({
        type: "POST",
        url: "data.xml",
        dataType: "xml",
        success: () => {
            console.log('Данные получены!');  
        },
        error: function(){
            alert('ERROR');
        }
    });
    return await response;
}