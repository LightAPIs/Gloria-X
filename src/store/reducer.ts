import isNull from 'lodash.isnull';

function handleFormat(commitData: store.CommitData): store.CommitData {
  const { title, message, iconUrl, imageUrl, url, id } = commitData;
  const formatData: store.CommitData = {};

  if (title) {
    formatData.title = title;
  } else {
    formatData.title = '';
  }

  if (message) {
    formatData.message = message;
  } else {
    formatData.message = '';
  }

  if (iconUrl) {
    formatData.iconUrl = iconUrl;
  }
  if (imageUrl) {
    formatData.imageUrl = imageUrl;
  }
  if (url) {
    formatData.url = url;
  }
  if (id) {
    formatData.id = id;
  }

  return formatData;
}

function commitFormat(commitData: store.CommitData | store.CommitData[]): store.CommitData | store.CommitData[] {
  if (Array.isArray(commitData)) {
    const formatArray: store.CommitData[] = [];

    commitData.forEach(data => {
      formatArray.push(handleFormat(data));
    });

    return formatArray;
  } else {
    return handleFormat(commitData);
  }
}

function handleReducer(commitData: store.CommitData, reducer: string): store.CommitData {
  if (reducer && reducer.trim()) {
    try {
      const reducerFunc = eval(`(function() {return ${reducer.trim()}})()`);
      let resultData = reducerFunc(commitData);
      if (Array.isArray(resultData)) {
        resultData = null;
      } else if (typeof resultData === 'object' && !isNull(resultData)) {
        resultData = handleFormat(resultData);
      } else if (resultData) {
        resultData = null;
      }
      return resultData;
    } catch (e) {
      console.error(e);
      //? 因为是传入对象的原因，所以会出现即使 Reducer 中出现语法错误，但是 commitData 被修改了的情况，
      //? 所以同样需要验证格式。
      return handleFormat(commitData);
    }
  } else {
    return commitData;
  }
}

function reduceNotification<T extends store.CommitData | store.CommitData[]>(commitData: T, reducer: string): T {
  if (Array.isArray(commitData)) {
    const dataArray: store.CommitData[] = [];
    commitData.forEach(data => {
      dataArray.push(handleReducer(data, reducer));
    });
    return dataArray.filter(v => v) as T;
  } else {
    return handleReducer(commitData as store.CommitData, reducer) as T;
  }
}

export { commitFormat, reduceNotification };
