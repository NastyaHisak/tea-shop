import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ProductService} from "../../shared/services/product.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy{

  public isSuccess: boolean = true;

  createOrderForm = this.fb.group({
    product: [''],
    comment: [''],
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-zа-яА-Я]+$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-zа-яА-Я]+$')]],
    phone: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{11}$')]],
    country: ['', [Validators.required]],
    index: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
    address: ['', [Validators.required, Validators.pattern('^[a-zA-zа-яА-Я0-9\\s\\-/]+$')]],
  })

  get product() {return this.createOrderForm.get('product');}
  get comment() {return this.createOrderForm.get('comment');}
  get firstName() {return this.createOrderForm.get('firstName');}
  get lastName() {return this.createOrderForm.get('lastName');}
  get phone() {return this.createOrderForm.get('phone');}
  get country() {return this.createOrderForm.get('country');}
  get index() {return this.createOrderForm.get('index');}
  get address() {return this.createOrderForm.get('address');}

  constructor(private fb: FormBuilder, private productService: ProductService,
              private renderer: Renderer2, private activatedRoute: ActivatedRoute, private elementRef: ElementRef) {
  }
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe((params) => {
      if(params['product']) {
        this.formValues.product = params['product'];
      }
    })
  }
  public formValues = {
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    index: '',
    product: '',
    address: '',
    comment: ''
  }
  createOrder(){
    this.productService.createOrder({
      name: this.createOrderForm.value.firstName!,
      last_name: this.createOrderForm.value.lastName!,
      phone: this.createOrderForm?.value.phone!,
      country: this.createOrderForm.value.country!,
      zip: this.createOrderForm.value.index!,
      product: this.createOrderForm.value.product!,
      address: this.createOrderForm.value.address!,
      comment: this.createOrderForm.value.comment
    })
      .subscribe(response => {
        if(response.success && !response.message) {
          this.isSuccess = true;
          const orderForm = this.elementRef.nativeElement.querySelector('#orderForm');
          this.renderer.setStyle(orderForm, 'display', 'none');
          const successOrder = this.elementRef.nativeElement.querySelector('#successOrder');
          this.renderer.setStyle(successOrder, 'display', 'block');

        } else {
          this.isSuccess = false;
        }
      })

    this.createOrderForm.reset();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
