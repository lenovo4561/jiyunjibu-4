/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import $ajax from '../ajax'

/**
 * @desc 在实际开发中，您可以将 baseUrl 替换为您的请求地址前缀；
 *
 * 已将 $apis 挂载在 global，您可以通过如下方式，进行调用：
 * $apis.user.init().then().catch().finally()
 */
const baseUrl = 'https://quick.shijinzhuang.com/'

export default {
  init(data) {
    return $ajax.get(`${baseUrl}user/init.do`, data)
  }
}
